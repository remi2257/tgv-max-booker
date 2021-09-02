import { default as axios } from "axios"


const apiKey = "bd3905a2-c30e-4751-9450-f4c235537c8b";

const from = "admin:fr:59350";
const to = "admin:fr:75056";
const datetime = "20210902T112332";

const axiosInstance = axios.create({
    // timeout: 3000,
});

let response = await axiosInstance.get(
    `https://api.sncf.com/v1/coverage/sncf/journeys/`,
    {
      params: {
        key: apiKey,

        from: from, // From where you come
        to: to, // To where you go

        datetime_represents: "departure",
        datetime: datetime,

        min_nb_journeys: 10,

      }
    }
  )
console.log(response);
