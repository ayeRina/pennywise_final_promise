import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName='login'>
      <Stack.Screen name="login" component="LoginScreen"/>
      <Stack.Screen name="signup" component="Signup"/>
      <Stack.Screen name="forgotpass" component="ForgotPass"/>
    </Stack>
  );
}
