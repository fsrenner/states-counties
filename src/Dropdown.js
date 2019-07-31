import React from 'react';
import Axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
import MapContainer from "./MapContainer";

class Dropdown extends React.Component {

    state = {
        states: [],
        selectedState: '',
        counties: [],
        selectedCounty: '',
        countyId: '',
        totalArea: '',
        geoJSON: []
    };

    componentDidMount() {
        Axios({
            url: 'https://coast.noaa.gov/dataservices/ENOW/GetENOWStateCounty_LookUp?&f=jsonp',
            adapter: jsonpAdapter,
            callbackParamName: 'c' // optional, 'callback' by default

        })
            .then(results => {
                const states = results.data.ENOWGeographyLookUp.State;
                console.log(states);
                this.setState({
                    states
                });
            })
            .catch(e => {
                console.log(JSON.stringify(e, null, 2));
            });
    }


    filterResultsByState = (e) => {
        const stateIndex = e.target.value;
        let selectedState = this.state.states[stateIndex];
        const counties = selectedState.County;
        selectedState = selectedState.GeoName;
        this.setState({
            selectedState: selectedState,
            counties
        });
    }

    displayTotalDevelopedArea = (e) => {
        const countyIndex = e.target.value;
        let selectedCounty = this.state.counties[countyIndex];
        const countyId = selectedCounty.GeoID;
        selectedCounty = selectedCounty.GeoName;
        console.log(countyId);
        Axios({
            url: `https://maps.coast.noaa.gov/arcgis/rest/services/CCAP_County_Comparison/Developed/MapServer/0/query?where=FIPSSTCO+%3D+${countyId}&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`,
            adapter: jsonpAdapter,
            callbackParamName: 'c' // optional, 'callback' by default
        })
            .then(results => {
                //console.log(JSON.stringify(results.data, null, 2));
                const totalArea = (results.data.features[0].attributes)
                    ? results.data.features[0].attributes['Shape.STArea()']
                    : 'Not found';
                const geoJSON = (results.data.features[0].geometry.rings)
                    ? results.data.features[0].geometry.rings[0]
                    : [];
                console.log(JSON.stringify(geoJSON, null, 2));
            this.setState({
                totalArea,
                geoJSON
            });
        })
            .catch(e => {
                console.log(JSON.stringify(e, null, 2));
            })
        this.setState({
            countyId,
            selectedCounty
        })
    }

    render() {
        const {
            states,
            selectedState,
            counties,
            selectedCounty,
            countyId,
            totalArea,
            geoJSON
        } = this.state;

        return (
            <div>
                <select name="" id="" onChange={this.filterResultsByState}>
                    {states.map((state, key) => {
                        state = state.GeoName;
                        return(
                            <option key={key} id={state} value={key}>{state}</option>
                        );
                    })}
                </select>
                <select name="" id="" onChange={this.displayTotalDevelopedArea}>
                    {counties.map((county, key) => {
                        county = county.GeoName;
                        return(
                            <option key={key} id={county} value={key}>{county}</option>
                        );
                    })}
                </select>
                <p>Selected County Info: State: {selectedState}, County: {selectedCounty}, County Id: {countyId}, Total Area: {totalArea} </p>
                {(geoJSON.length !== 0) ? <MapContainer path={geoJSON}/> : null}
            </div>
        );
    }
}

export default Dropdown;