import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  state: any
  operator: any
  plans: any
  mobNum: any

  showInput: boolean = true
  showPlan: boolean = false
  showPay: boolean = false

  btnPay: boolean = true
  loadWait: boolean = false
  loadDone: boolean = false

  selectState: any
  selectOperator: any
  statusRecharge: any

  user = {
    user_state: '',
    user_oprator: '',
    user_plan: '',
    user_mobile: '',
    amount: '',
    status: 'pending'
  }

  // "user_mobile": "1234567892",
  // "user_oprator": "Jio",
  // "user_plan": "Data Rocket",
  // "user_state": "Uttar Pradesh",
  // "amount": "1122",
  // "status": "Done"
  currentDate: any
  constructor(private http: HttpClient) { 
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/state')
      .subscribe(
        rec => {
          this.state = rec
          console.log(rec, "Data")
        }
      )
  }

  onSubmit(getState: any) {
    this.user.user_state = getState
    console.log("Form Submitted.........", getState)
    this.selectState = getState
    this.http.get('http://127.0.0.1:8000/api/operator?state=' + getState)
      .subscribe(
        rec => {
          this.operator = rec
          console.log(rec, "Data")
        }
      )
  }

  onNext(getOperator: any, getMobile: any) {
    this.showInput = false
    this.showPlan = true
    this.showPay = false
    this.selectOperator = getOperator
    this.user.user_oprator = getOperator
    this.user.user_mobile = getMobile
    this.allPlan()
  }

  onBack(tab: any) {
    if (tab == 'Plan') {
      this.showInput = true
      this.showPlan = false
      this.showPay = false
    }
    if (tab == 'Pay') {
      this.showInput = false
      this.showPlan = true
      this.showPay = false
    }
  }

  allPlan() {
    let params = new HttpParams();
    params = params.append('state', this.selectState);
    params = params.append('operator', this.selectOperator)
    console.log("Param .........", params)
    this.http.get('http://127.0.0.1:8000/api/plan', { params: params })
      .subscribe(
        rec => {
          this.plans = rec
          console.log(rec, "Data")
        }
      )
  }

  planfilter(getData: any) {
    let params = new HttpParams();
    params = params.append('state', this.selectState);
    params = params.append('operator', this.selectOperator)
    params = params.append('plan_category', getData)
    console.log("Param .........", params)
    this.http.get('http://127.0.0.1:8000/api/plan', { params: params })
      .subscribe(
        rec => {
          this.plans = rec
          console.log(rec, "Data")
        }
      )
  }

  payNow(getAmount: any, getPlan: any) {
    this.user.amount = getAmount
    this.user.user_plan = getPlan
    this.showInput = false
    this.showPlan = false
    this.showPay = true
  }

  onPay() {
    this.http.post<any>('http://127.0.0.1:8000/api/history', this.user).subscribe(res => {
      console.log("save", res.status, res.message, res.data, res.success)
      if (res) {
        this.btnPay = false
        this.loadWait = true
        setTimeout(() => {
          this.loadWait = false
          this.loadWait = false
          this.loadDone = true
          const body = { status: 'Done' }
          this.http.put<any>('http://127.0.0.1:8000/api/history/' + res.id, body)  //id
            .subscribe(data => {
              console.log("save", this.user)
              if (data) {
                this.statusRecharge = data.status
                console.log("save", data.status)
              }
            })
        }, 3000)

    
      }
      else {
        alert("Payment Failed")
      }

    })
  }

  Close(){
    this.btnPay = true
    this.loadWait = false
    this.loadDone = false
    this.showInput = true
    this.showPlan = false
    this.showPay = false
  }


}
