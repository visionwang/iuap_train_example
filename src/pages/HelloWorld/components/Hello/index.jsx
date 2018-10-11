import React, { Component } from 'react';
import {Button} from 'tinper-bee';
import { actions } from "mirrorx";

import './index.less'

class Hello extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    handleClick = async()=>{
        await actions.HelloWorld.loadData();
        alert(this.props.hellomsg);
    }
    render() {
        return (
            <div>
                <Button className="mt20 ml20" colors="primary" onClick={ this.handleClick }>点击测试</Button>
            </div>
        );
    }
}

export default Hello;