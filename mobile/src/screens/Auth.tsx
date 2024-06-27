import React, { Component, ReactNode } from 'react';
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, NavigationProp } from '@react-navigation/native';
import backgroundImage from '../../assets/images/login.jpg';
import commonStyles from '../functions/commonStyles';
import AuthInput from '../components/AuthInput';

import { server, showError, showSuccess } from '../functions/common';

interface UserData {
    token: string;
    name: string;
    email: string;
}

interface Props {
    navigation: NavigationProp<any>;
}

interface State {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    stageNew: boolean;
}

const initialState: State = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false,
};

export default class Auth extends Component<Props, State> {
    state: State = { ...initialState };

    signinOrSignup = (): void => {
        if (this.state.stageNew) {
            this.signup();
        } else {
            this.signin();
        }
    };

    signup = async (): Promise<void> => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            });

            showSuccess('Usuário cadastrado!');
            this.setState({ ...initialState });
        } catch (e: any) {
            showError(e);
        }
    };

    signin = async (): Promise<void> => {
        try {
            const res = await axios.post<UserData>(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password,
            });

            AsyncStorage.setItem('userData', JSON.stringify(res.data));
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`;

            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: res.data }],
                })
            );
        } catch (e: any) {
            showError(e);
        }
    };

    render(): ReactNode {
        const validations: boolean[] = [];
        validations.push(Boolean(this.state.email && this.state.email.includes('@')));
        validations.push(Boolean(this.state.password && this.state.password.length >= 6));

        if (this.state.stageNew) {

            validations.push(Boolean(this.state.name && this.state.name.trim().length >= 3));
            validations.push(this.state.password === this.state.confirmPassword);
        }

        const validForm: boolean = validations.reduce((t, a) => t && a);

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew && (
                        <AuthInput
                            icon="user"
                            placeholder="Nome"
                            value={this.state.name}
                            style={styles.input}
                            onChangeText={(name) => this.setState({ name })}
                        />
                    )}
                    <AuthInput
                        icon="at"
                        placeholder="E-mail"
                        value={this.state.email}
                        style={styles.input}
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <AuthInput
                        icon="lock"
                        placeholder="Senha"
                        value={this.state.password}
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />
                    {this.state.stageNew && (
                        <AuthInput
                            icon="asterisk"
                            placeholder="Confirmação de Senha"
                            value={this.state.confirmPassword}
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={(confirmPassword) =>
                                this.setState({ confirmPassword })
                            }
                        />
                    )}
                    <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7,
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
});