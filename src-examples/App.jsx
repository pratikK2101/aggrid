import React, {Component} from "react";
import RichGridDeclarativeExample from "./richGridDeclarativeExample/RichGridDeclarativeExample";

class App extends Component {
    render() {
        return (
            <div style={{display: "inline-block", width: "100%"}}>
                <div style={{width: '90%', marginRight:'5%', marginLeft:'5%'}}>
                    <RichGridDeclarativeExample/>
                </div>
            </div>
        )
    }
}

export default App
