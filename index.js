import axios from "axios";
import fs from "fs";
import moment from "moment";
moment.locale("fr");

const saveJson = false;

const params = {
  departureTown: {
    codes: { resarail: "FRPAR" },
  },
  destinationTown: {
    codes: { resarail: "FRLIL" },
  },
  features: ["TRAIN"],
  outwardDate: "2021-09-03T18:00:00.000+02:00",
  passengers: [
    {
      age: 25,
      ageRank: "YOUNG",
      birthday: "1996-03-11",
      commercialCard: { number: "HC900438611", type: "HAPPY_CARD" },
      fidNumber: "29090109531898939",
      type: "HUMAN",
    },
  ],
  travelClass: "SECOND",
};

const axiosInstance = axios.create({
  baseURL: "https://wshoraires.oui.sncf",
});

const response = await axiosInstance
  .post("/vmd/v1/quotations/train", params, {
    headers: {
      "X-Device-Type": "ANDROID",
      "X-Hr-Version": "88.5.2",
      "X-Vsc-Locale": "fr_FR",
      "Accept-Language": "fr-FR",
      Accept: "application/json",
    },
  })
  .catch(function (error) {
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.config);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
  });

const journeys = response.data.journeys;

if (saveJson) {
  try {
    fs.writeFileSync("test_save.json", JSON.stringify(journeys[0]));
  } catch (err) {
    console.error(err);
  }
}

var countTgvMax = 0;
for (const journey of journeys) {
  const price = journey.price.value;
  if (price > 0) {
    continue;
  }
  countTgvMax += 1;

  const departureDate = moment(journey.departureDate);
  const arrivalDate = moment(journey.arrivalDate);

  const departureStation = journey.departureStation.name;
  const arrivalStation = journey.arrivalStation.name;

  console.log("Voyage trouvé le", departureDate.format("dddd Do MMMM"));
  console.log("De", departureStation, "à", arrivalStation);
  console.log(departureDate.format("LT"), "-", arrivalDate.format("LT"));
}

console.log("Found", countTgvMax, "TGV Max");
