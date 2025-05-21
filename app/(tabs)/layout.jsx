import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import tw from 'twrnc';
import icon from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {  
    return (
        <View>
            <Image
                source={icon}  
                resizeMode='contain'
                style={[tw`w-6 h-6`, { tintColor: color }]}  
            />
        </View>
    );
};

const TabsLayout = () => {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icon.home}  
                                color={color}
                                name="Home"
                                focused={focused}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="transaction"
                    options={{
                        title: 'Transaction',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icon.transaction}  
                                color={color}
                                name="Transaction"
                                focused={focused}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icon.profile}  
                                color={color}
                                name="Profile"
                                focused={focused}
                            />
                        ),
                    }}
                />  
                
            </Tabs>
        </>
    );
};

export default TabsLayout;