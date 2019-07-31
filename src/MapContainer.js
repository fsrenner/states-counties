import React, { Component, Fragment } from "react";

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Polygon
} from "react-google-maps";

class MapContainer extends Component{

    static defaultProps = {
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBaVrtHd4bptxiercBBkXhT5aPyWh_E7cg&libraries=geometry,drawing,places",
    }

    Map = withScriptjs(withGoogleMap(props =>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
            <Polygon path={this.props.path}/>
        </GoogleMap>
    ));

    render() {
        return (
            <Fragment>
                <this.Map
                    googleMapURL={this.props.googleMapURL}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `700px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    center= {{ lat: 25.03, lng: 121.6 }}
                />
            </Fragment>
        );
    }
}


export default MapContainer;