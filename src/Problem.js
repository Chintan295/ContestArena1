import React from 'react'
import {getCookie,refresh_token,Logout} from './Login'
import axios from 'axios'
import { Redirect,Link } from 'react-router-dom';
class Problem extends React.Component{
    constructor(){
        super();
        var url=window.location.href.split('/');
        this.state={contestCode:url[url.length-2],problemCode:url[url.length-1],problem:null,submit:false}
        this.getProblemDetails=getProblemDetails.bind(this);
        if(this.state.problem==null)
            this.getProblemDetails();
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
        var Latex = require('react-latex');
        
        if(this.state.problem!=null){
            var statement=this.state.problem.data.result.data.content.body;
            statement=statement.split("###").join("");
            console.log(statement);
            statement=statement.split('<br />')
            return <div className="background">
                <Link to={'/my-app/submit/'+this.state.problem.data.result.data.content.problemCode}><button className="b1 b2">Submit</button></Link>
                <button className="b1 topright" onClick={this.logout}>Logout</button>
                <Link to={'/my-app/Gotocontest'}><button className="b1 b3">Home</button></Link>
                <h1 className="center">{this.state.problem.data.result.data.content.problemName}</h1>
                <h4 className="center">{this.state.problem.data.result.data.content.problemCode}</h4 ><hr/>
                <div className="statement">
                    <h3>Problem</h3>
                    {statement.map((item)=><div><Latex>{item}</Latex><br/></div>)}
                </div>
                <hr/>
                <div className="statement">
                    <p>Author : {this.state.problem.data.result.data.content.author}</p>
                    <p>DateAdded : {this.state.problem.data.result.data.content.dateAdded}</p>
                    <p>Time Limit : {this.state.problem.data.result.data.content.maxTimeLimit} secs</p>
                    <p>Source Limit : {this.state.problem.data.result.data.content.sourceSizeLimit}</p>
                    <p>Tags : {this.state.problem.data.result.data.content.tags.toString()}</p>
                    <p>Languages : {this.state.problem.data.result.data.content.languagesSupported.toString()}</p>
                </div>
            </div>
        }
        else
        return <div className="background">
                    <div className="wrap">
                        <div className="spinner-wrap">
                            <div className="spinner">
                                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                            </div>
                        </div>
                    </div>
            </div>
    }
}

function getProblemDetails(){
    axios.get(`https://api.codechef.com/contests/`+this.state.contestCode+`/problems/`+this.state.problemCode,
                {headers:{'Content-Type': 'application/json',
                           'Accept': 'application/json',
                           'Authorization': 'Bearer '+ getCookie('token')
                          }
    })
  .then(res => {    
      console.log(res);
      this.setState({problem:res});
  })
  .catch(function (error) {
    console.log(error.message);
  });
}
export default Problem;