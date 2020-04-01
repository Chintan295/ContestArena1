import React from 'react'
import {getCookie,refresh_token,Logout} from './Login'
import axios from 'axios'
import { Redirect,Link } from 'react-router-dom';
import './Submit.css'
import './General.css'
import './Loding.css'
class Submit extends React.Component{
    constructor(){
        super();
        this.state = {
            input:'',
            code:'',
            output:'',
            language:'C',
            link:'',
            languageList:[],
            cmpInfo:"",
            run:false
        };
    }
    codeChange=(event)=> {
        event.persist();
        this.setState({code: event.target.value});
    }
    inputChange=(event)=> {
        event.persist();
        this.setState({input: event.target.value});
    }
    languageChange=(event)=>{
        event.persist();
        this.setState({language: event._targetInst.stateNode.selectedOptions["0"].value});
    }
    getLink=()=>{
        let data={
            "sourceCode":this.state.code.toString(),
            "language": this.state.language,
            "input": this.state.input
            };
        axios.post(`https://api.codechef.com/ide/run`,
                    data,
                    {headers:{'Content-Type': 'application/json',
                              'Accept': 'application/json',
                              'Authorization': 'Bearer '+ getCookie('token')}
        })
        .then(res => {
            this.setState({link:res.data.result.data.link,run:true,output:"",cmpInfo:""});
        })
        .catch(function (error) {
            console.log(error.message);
        });
    }
    Run=()=>{
        console.log(this.state.link);
        axios.get(`https://api.codechef.com/ide/status?link=`+this.state.link,
        {headers:{'Content-Type': 'application/json',
                   'Accept': 'application/json',
                   'Authorization': 'Bearer '+ getCookie('token')
                  }
            })
        .then(res => {
            console.log(res);
            this.setState({output:res.data.result.data.output,cmpInfo:res.data.result.data.cmpinfo});
        })
        .catch(function (error) {
            console.log(error.message);
        });
    }
    getLanguageList=()=>{
        axios.get(`https://api.codechef.com/language?limit=100`,
        {headers:{'Content-Type': 'application/json',
                   'Accept': 'application/json',
                   'Authorization': 'Bearer '+ getCookie('token')
                  }
            })
        .then(res => {
            this.setState({languageList:res.data.result.data.content});
            console.log(res.data.result.data.content);
        })
        .catch(function (error) {
            console.log(error.message);
        });
    }
    logout=()=>{
        Logout();
        this.setState({});
    }
    render(){
        if(getCookie('refresh_token')==""){
            return <Redirect to='/my-app'/>;
        }
        refresh_token();
        if(this.state.run&&this.state.output==""&&this.state.cmpInfo=="")
        {
            setTimeout(this.Run,5000);
        }
        else if(this.state.run){
            this.setState({run:false});
        }
        if(this.state.languageList.length==0)
            this.getLanguageList();
        return <div className="background">
            <Link to={'/my-app/Gotocontest'}><button className="b1 b2">Home</button></Link>
            <button className="b1 topright" onClick={this.logout}>Logout</button>
            <div>
                <h1>Enter your code here :</h1>
                <label>Choose a language:</label>
                <select value={this.state.language} onChange={this.languageChange}>
                    {(this.state.languageList.length!=0?
                        this.state.languageList.map((item,i)=> <option key={i}>{item.shortName}</option>):
                        <option>C</option>)}
                </select><br/>
                <textarea value={this.state.code} onChange={this.codeChange} className="textarea size1"></textarea><br/>
            </div>
            <div className="pos1">
                <h3>Input :</h3>
                <textarea value={this.state.input} onChange={this.inputChange} className="textarea size2"></textarea>
                <h3>Output :</h3>
                <textarea value={(this.state.output==""?this.state.cmpInfo:this.state.output)} className="textarea size2"></textarea><br/>
            </div>
            <div className="center">
                {(this.state.run?<button className="loding">Running...</button>:<button onClick={this.getLink}>Run</button>)}
            </div>
        </div>
    }
}
export default Submit;
