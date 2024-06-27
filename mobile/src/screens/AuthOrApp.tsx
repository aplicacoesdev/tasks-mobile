import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { CommonActions, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
    token: string;
    name: string;
    email: string;
}

interface AuthOrAppProps {
    navigation: NavigationProp<any>;
}

export default class AuthOrApp extends Component<AuthOrAppProps> {
    componentDidMount = async (): Promise<void> => {
        const userDataJson = await AsyncStorage.getItem('userData');
        let userData: UserData | null = null;

        try {
            userData = JSON.parse(userDataJson || '');
        } catch (e) {
            // userData está inválido
        }

        if (userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`;
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: userData }],
                })
            );
        } else {
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                })
            );
        }
    };

    render(): React.ReactNode {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});