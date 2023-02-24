import React from 'react';
import MyContext from './appContext';
import tokenStorage from '../services/tokenStorage';
import { setAxiosAuthorizationHeader } from '../axiosConfig';

class MyProvider extends React.Component {
    state = {
        selectedRout: "Dashboard",
        user: {},
        receiptMeta: {}
    }
    componentDidMount() {
        this.setState({ user: tokenStorage.getUserInfo() })
        this.setTokensFromLocalStorage(tokenStorage.getToken())
    }

    setTokensFromLocalStorage = (token) => {
        if (token) {
            setAxiosAuthorizationHeader(token);
        }
    }
    updateState = (name, value) => {
        this.setState({ ...this.state, [name]: value })
    }
   
    render() {
        return (
            <MyContext.Provider
                value={{
                    state: this.state,
                    updateState: this.updateState,
                    setTokensFromLocalStorage: this.setTokensFromLocalStorage
                }}
            >
                <div className={this.state.user?.language === "urdu" ? "lang-ur" : ""}>
                    {this.props.children}
                </div>
            </MyContext.Provider>
        );

    }
}

export default MyProvider