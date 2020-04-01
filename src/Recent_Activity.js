import React from 'react'
import {getCookie,refresh_token,Logout} from './Login'
import {Redirect,Link} from 'react-router-dom'
import axios from 'axios'
import {getContestDetails} from './Contestpage'
import './Contestpage.css'
import './Loding.css'

class Recent_Activity extends React.Component{
    constructor(){
        super();
        var url=window.location.href.split('/');
        this.state={recentSubmissions:[],code:url[url.length-1],offset:0,page:1}
    }
    prev=()=>{
        var pag=this.state.page;
        this.setState({recentSubmissions:[],page:pag-1,offset:(pag-1)*20});
    }
    next=()=>{
        var pag=this.state.page;
        this.setState({recentSubmissions:[],page:pag+1,offset:(pag)*20});
    }
    getRecentSubmissions=()=>{
        axios.get(`https://api.codechef.com/submissions/?contestCode=`+this.state.code+`&limit=20&offset=`+this.state.offset,
                {headers:{'Content-Type': 'application/json',
                           'Accept': 'application/json',
                           'Authorization': 'Bearer '+ getCookie('token')
                          }
            })
        .then(res => {
            this.setState({recentSubmissions:res.data.result.data.content});
            console.log(res);
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
        if(this.state.recentSubmissions.length!=0){
            return <div className="background">
                <Link to={'/my-app/Gotocontest'}><button className="b1 b2">Home</button></Link>
                <button className="b1 topright" onClick={this.logout}>Logout</button>
                <h1 className="center">Recent_Activity</h1>
                <table className="rankList content"> 
                    <tbody>
                        <tr>
                            <th><b>Date</b></th>
                            <th><b>USERNAME</b></th>
                            <th><b>Problem</b></th>
                            <th><b>Result</b></th>
                            <th><b>Language</b></th>
                        </tr>
                        {this.state.recentSubmissions.map((item,i)=>
                            <tr key={i}>
                                <td>{item.date}</td>
                                <td>{item.username}</td>
                                <td>{item.problemCode}</td>
                                <td>{item.result}</td>
                                <td>{item.language}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="center">
                    {(this.state.page!=1?<button onClick={this.prev} className="b1">Prev</button>:<p></p>)}
                    <label>{this.state.page}</label>
                    {(this.state.recentSubmissions.length==20?<button onClick={this.next} className="b1">Next</button>:<p></p>)}
                </div>
            </div>
        }
        else{
            this.getRecentSubmissions();
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
}
export default Recent_Activity;