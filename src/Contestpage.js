import React from 'react'
import {getCookie,refresh_token,Logout} from './Login'
import axios from 'axios'
import Timer from 'react-compound-timer'
import './Contestpage.css'
import './Gotocontest.css'
import { Redirect,Link } from 'react-router-dom';

class Contestpage extends React.Component{
    constructor(){
        super();
        var url=window.location.href.split('/');
        this.state={code : url[url.length-1],
                    contest : null,
                    problemDetails : [],
                    last : 0,
                    children : []
                }
        this.getContestDetails=getContestDetails.bind(this);
        this.getProblemsDetailsList=getProblemsDetailsList.bind(this);
    }
    remainingTime=()=>{
        var contestEndTime = new Date(this.state.contest.data.result.data.content.endDate);
        var remainingTime=contestEndTime-new Date().getTime();
        if(remainingTime>0) return remainingTime;
        else return 0;
    }
    logout=()=>{
        Logout();
        this.setState({});
    }
    goDiv1=()=>{
        this.setState({
            code: this.state.children[0],
            contest: null,
            problemDetails: [],
            last: 0,
            children: []
        });
    }
    goDiv2=()=>{
        this.setState({
            code: this.state.children[1],
            contest: null,
            problemDetails: [],
            last: 0,
            children: []
        });
    }
    render(){
        if(getCookie('refresh_token')==""){
            return <Redirect to='/my-app'/>;
        }
        refresh_token();
        if(this.state.contest==null){
            this.getContestDetails();
        }
        else if(this.state.contest!=null&&this.state.problemDetails.length!=this.state.contest.data.result.data.content.problemsList.length){
          this.getProblemsDetailsList(this.state.contest);
        }
        else if(this.state.contest!=null&&this.state.problemDetails.length==this.state.contest.data.result.data.content.problemsList.length){
            console.log(this.state.problemDetails);
            return <div className="background"> 
              <button className="b1 topright" onClick={this.logout}>Logout</button>
              <Link to={'/my-app/Gotocontest'}><button className="b1 b2">Home</button></Link>
              <h1 className="center">{this.state.contest.data.result.data.content.name}</h1>
              <h5 className="center">{this.state.contest.data.result.data.content.code}</h5>
              <hr/>
              <div className="contestInfo">
                    {(this.remainingTime()!=0?
                    <Timer initialTime={this.remainingTime()} direction="backward">
                        {() => (
                            <React.Fragment>
                                <h4><u>Contest starts in</u></h4>
                                <div className="timer">
                                   <div><Timer.Days /></div><br/>Days
                                </div>
                                <div className="timer">
                                    <div><Timer.Hours /></div><br/>Hrs
                                </div>
                                <div className="timer">
                                    <div><Timer.Minutes /></div><br/>Mins
                                </div>
                                <div>
                                    <div><Timer.Seconds /></div><br/>Secs
                                </div>
                            </React.Fragment>
                        )}
                    </Timer>:
                    <h2>Contest Ended</h2>)
                    }  
                    <Link to={'/my-app/ranklist/'+this.state.code}><button className="content b1">Gotoranklist</button></Link>
                    <Link to={'/my-app/recent_activity/'+this.state.code}><button className="content b1">Recent Activity</button></Link>
              </div>
              {(this.state.children.length==0?
              <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>problemName</th>
                        <th>problemCode</th>
                        <th>Accepted</th>
                        <th>Accuracy</th>
                    </tr>
                    {this.state.problemDetails.map((item,i)=>
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td><Link to={'/my-app/contest/'+this.state.code+'/'+item.problem.problemCode}>{item.problem.problemName}</Link></td>
                            <td><Link to={'/my-app/contest/'+this.state.code+'/'+item.problem.problemCode}>{item.problem.problemCode}</Link></td>
                            <td>{item.problem.successfulSubmissions}</td>
                            <td>{item.accuracy.toFixed(2)}</td>
                        </tr>
                    )}
               </tbody>
              </table>:
              <div>
                  <Link to={'/my-app/contest/'+this.state.children[0]}>
                  <div className="division1" onClick={this.goDiv1}>
                        Div1
                  </div>
                  </Link>
                  <Link to={'/my-app/contest/'+this.state.children[1]}>
                  <div className="division2" onClick={this.goDiv2}>
                        Div2   
                  </div>
                  </Link>
              </div>
              )}
            </div>
        }
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
export function getContestDetails(){
    axios.get(`https://api.codechef.com/contests/`+this.state.code,
                {headers:{'Content-Type': 'application/json',
                           'Accept': 'application/json',
                           'Authorization': 'Bearer '+ getCookie('token')
                          }
    })
  .then(res => {
      this.setState({contest: res, children: res.data.result.data.content.children});
      console.log(res);
  })
  .catch(function (error) {
    console.log(error.message);
  });
}

function getProblemsDetailsList(contest){
        let contestCode=contest.data.result.data.content.code;
        let problemCode=contest.data.result.data.content.problemsList[this.state.last].problemCode;
        console.log(contestCode);
        axios.get(`https://api.codechef.com/contests/`+contestCode+`/problems/`+problemCode,
                {headers:{'Content-Type': 'application/json',
                           'Accept': 'application/json',
                           'Authorization': 'Bearer '+ getCookie('token')
                          }
            })
        .then(res => {
            var temp={
                code:problemCode,
                accuracy:contest.data.result.data.content.problemsList[this.state.last].accuracy,
                problem:res.data.result.data.content
            }
            let tempProblemDetails=this.state.problemDetails;
            tempProblemDetails.push(temp);
            this.setState({problemDetails:tempProblemDetails,last:this.state.last+1});
        })
        .catch(function (error) {
            console.log(error.message);
        });
}
export default Contestpage;