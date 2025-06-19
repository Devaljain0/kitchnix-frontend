import { SigninAuth } from "../components/LoginAuth"
import Quote from "../components/Quote"


function Login(){


    return(
        <div className="grid grid-cols-2">
            <Quote/>
            <SigninAuth/>
        </div>
    )
}

export default Login