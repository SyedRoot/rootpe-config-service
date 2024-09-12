import axios from "axios";

const ESCROW_URL = "http://api.sandbox.rootpe.com";


export async function fetchToken() {
  let response = await axios.post(
    "https://dev-rootpe.us.auth0.com/oauth/token",
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_SECRET,
      audience: "https://sandbox.rootpe.com/",
      grant_type: "client_credentials",
    }
  );

  return response.data.access_token;
}

async function escrowInfo(id: string, authToken: string) {
  const response = await axios.get(`${ESCROW_URL}/escrows/${id}`, {
      headers: {
          Authorization: `Bearer ${authToken}`
      }
  });

  return response.data;
}

export async function createGamingEscrow(authToken: string) {
  const response = await axios.post(`${ESCROW_URL}/escrows/gaming/create`, {
    name: "gaming escrow [demo]",
    currency: "f48ee79e-5a38-33a3-918e-c7faaa0d2ce0", // GINRC
    start_funding_amount: 10,
    end_funding_amount: 1000,
    fee_percentage: 10000,
    is_reward_percentage: true,
    reward_amount: [0],
    reward_percentage: [9000],
  }, {
      headers: {
          Authorization: `Bearer ${authToken}`
      }
  });

  return response.data;
}

async function updateMap(final: object[]) {
    console.log("\nstub: should update map.");
    console.log(final);
}

async function main() {
    console.log("> fetching original map..");
    let orig = (await axios.get("https://raw.githubusercontent.com/RootPe/rootpe-config-service/main/game-escrow-map.json")).data;
    let final = [...orig];

    console.log("> fetching an auth token..");
    const authToken = await fetchToken();

    console.log("> looking for expired escrows..\n");
    for (let i=0; i < orig.length; i++) {
        const entry = orig[i];

        const { data: info } = await escrowInfo(entry.escrowId, authToken);

        if (info.status != "FUNDING") {
            console.log(`>> escrowId ${info.id} is not in funding state. checking possible options..`)

            switch (info.status) {
                case "INITIALIZED":
                  console.log("    >>> can be put into funding state. not implemented.")
                  break;
                default:
                  console.log("    >>> unfixable situation. creating new..")

                  const { data: newEscrow } = await createGamingEscrow(authToken);
                  console.log(`    >>> done: ${newEscrow.id}`)

                  final[i].escrowId = newEscrow.id;
            };
        }
    }

    if (orig === final) {
        console.log("> original map same as final. exiting..");
        return;
    }

    updateMap(final);
}

main();
