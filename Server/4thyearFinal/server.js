//Dependencies And MiddleWare
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');  

const schema = buildSchema(`
  type WeatherData {
    time: String
    airTemperature: Float
    waveHeight: Float
    waterTemperature: Float
    wavePeriod: Float
    waveDirection: Float
    swellDirection: Float
    swellHeight: Float
    windDirection: Float
    windSpeed: Float
    secondarySwellDirection: Float
    secondarySwellHeight: Float
  }

  type TideData {
    time: String
    height: Float
    type: String
  }

  type Query {  
    getWeatherData(lat: Float!, lng: Float!, params: String!): [WeatherData]
    getTideData(lat: Float!, lng: float!): [TideData]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  getWeatherData: async ({ lat, lng, params }) => {
    try {
      const response = await axios.get('https://api.stormglass.io/v2/weather/point', {
        params: {
          lat: lat,
          lng: lng,
          params: 'airTemperature,waveHeight,waterTemperature,wavePeriod,waveDirection,swellDirection,swellHeight,windDirection,windSpeed,secondarySwellDirection,secondarySwellHeight'
        },
        headers: {
          'Authorization': '1baca720-772c-11ee-92e6-0242ac130002-1baca784-772c-11ee-92e6-0242ac130002'  // Replace with your actual API key
        }
      });
      
      // Extract and return the data as required by your GraphQL schema
      return response.data.hours.map(hour => ({
        time: hour.time,
        airTemperature: hour.airTemperature && hour.airTemperature.sg,
        waveHeight: hour.waveHeight && hour.waveHeight.sg,
        waterTemperature: hour.waterTemperature && hour.waterTemperature.sg,
        wavePeriod: hour.wavePeriod && hour.wavePeriod.sg,
        waveDirection: hour.waveDirection && hour.waveDirection.sg,
        swellDirection: hour.swellDirection && hour.swellDirection.sg,
        swellHeight: hour.swellHeight && hour.swellHeight.sg,
        windDirection: hour.windDirection && hour.windDirection.sg,
        windSpeed: hour.windSpeed && hour.windSpeed.sg,
        secondarySwellDirection: hour.secondarySwellDirection && hour.secondarySwellDirection.sg,
        secondarySwellHeight: hour.secondarySwellHeight && hour.secondarySwellHeight.sg
      }));
    } catch (error) {
      console.error('Error response:', error.response.data); 
      throw new Error("Failed to fetch weather data.");
    }
  },

  getTideData: async ({ lat, lng }) => {
    try {
      const response = await axios.get('https://www.worldtides.info/api/v2', {
        params: {
          lat: lat,
          lon: lng,
          key: '9a287ea2-3c7c-4c3b-a65b-c7847a1f97f3'  // Replace with your actual WorldTides API key
        }
      });

      // Extract and return the tide data as required by your GraphQL schema
      return response.data.extremes.map(tide => ({
        time: tide.date,
        height: tide.height,
        type: tide.type // High or Low tide
      }));
    } catch (error) {
      console.error('Error response:', error.response.data);
      throw new Error("Failed to fetch tide data.");
    }
  }
};

const app = express();

app.use(cors({
  origin: 'http://localhost:8100', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
// Enable GraphiQL interface for easier querying
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, 
}));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
