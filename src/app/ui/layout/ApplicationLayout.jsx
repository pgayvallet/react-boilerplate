import * as React from "react"

export class ApplicationLayout extends React.Component {

    render() {
        return (
            <div className="main-container">
                {this.props.children}
            </div>
        );
    }

}