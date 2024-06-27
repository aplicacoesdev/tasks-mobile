import React from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import Auth from './screens/Auth';
import TaskList from './screens/TaskList';
import AuthOrApp from './screens/AuthOrApp';
import Menu from './screens/Menu';
import commonStyles from './functions/commonStyles';

type StackProps = {
    AuthOrApp: any;
    Auth: any;
    Home: { email: string; name: string };
};

type DrawerProps = {
    Today: { title: string };
    Tomorrow: { title: string };
    Week: { title: string };
    Month: { title: string };
};

const Stack = createStackNavigator<StackProps>();
const Drawer = createDrawerNavigator<DrawerProps>();

const menuConfig = {
    labelStyle: {
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'normal',
        fontSize: 20,
    },
    activeTintColor: '#080',
    headerShown: false,
};

type DrawerNavigatorProps = {
    route: RouteProp<StackProps, 'Home'>;
    navigation: DrawerNavigationProp<DrawerProps>;
};

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ route }) => {
    const { email, name } = route.params;
    return (
        <Drawer.Navigator screenOptions={menuConfig}
            drawerContent={(props) => <Menu {...props} email={email} name={name} />}>
            <Drawer.Screen name="Today" options={{ title: 'Hoje' }}>
                {props => <TaskList {...props} title='Hoje' daysAhead={0} />}
            </Drawer.Screen>
            <Drawer.Screen name="Tomorrow" options={{ title: 'Amanhã' }}>
                {props => <TaskList {...props} title='Amanhã' daysAhead={1} />}
            </Drawer.Screen>
            <Drawer.Screen name="Week" options={{ title: 'Semana' }}>
                {props => <TaskList {...props} title='Semana' daysAhead={7} />}
            </Drawer.Screen>
            <Drawer.Screen name="Month" options={{ title: 'Mês' }}>
                {props => <TaskList {...props} title='Mês' daysAhead={30} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
};

const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthOrApp" component={AuthOrApp} />
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Home" component={DrawerNavigator} />
        </Stack.Navigator>
    );
};

const Navigator: React.FC = () => {
    return (
        <NavigationContainer>
            <AuthNavigator />
        </NavigationContainer>
    );
};

export default Navigator;