import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import "./App.css"

const MapContainer = (props) => {

  const [jsonData, setJsonData] = useState()
  const [adrsData, setAdrsData] = useState()

  useEffect(() => {
    fetch("https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LATEST_CORE_SITE_READINGS/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson")
      .then(res => res.json())
      .then(data => setJsonData(data))
      .catch((err) => console.log(err))
  }, [])

  var sampleGeoJson = jsonData?.features
    .map((val) => Object.entries(val))
    .map((val) => ({ longitude: val[2][1].coordinates[0], latitude: val[2][1].coordinates[1], place: val[3][1].SITE_NAME, address: val[3][1].SITE_ADDRESS }))

  const displayMarkers = () => {
    return sampleGeoJson?.map((resData, index) => {
      return <Marker key={index} id={index} position={{
        lat: resData.latitude,
        lng: resData.longitude
      }}
        onClick={() => {
          setAdrsData(resData)
          setToDisplay(true)
        }} />
    })
  }

  const [toDisplay, setToDisplay] = useState()

  const popUpWindow = (localData) => {
    return (
      toDisplay &&
      <div className="popupContainer">
        <button className="closeBtn" onClick={() => setToDisplay(false)}>x</button>
        <h1>{localData?.place}</h1>
        <h4><strong>Address: </strong>{localData?.address}</h4>
        <p><strong>Latitude: </strong>{localData?.latitude} | <strong>Longitude: </strong>{localData?.longitude}</p>
      </div>
    )
  }

  return (
    <div onClick={() => setToDisplay(false)}>
      {popUpWindow(adrsData)}
      <Map
        google={props.google}
        zoom={10}
        style={{ width: '100%', height: '100%' }}
        initialCenter={{ lat: 40.046732, lng: -75.028017 }}
      >
        {displayMarkers()}
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCn6i-1f74LiwnmTbtDlf4qye4MKMd6gIc'
})(MapContainer);