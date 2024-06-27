import { Alert, Platform } from 'react-native';
import { AxiosError } from 'axios';

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

function showError(err: AxiosError | Error) {
    if ((err as AxiosError).response && (err as AxiosError).response?.data) {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${(err as AxiosError).response?.data}`);
    } else {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.message}`);
    }
}

function showSuccess(msg: string) {
    Alert.alert('Sucesso!', msg);
}

export { server, showError, showSuccess };