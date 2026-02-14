import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/supabase/SupabaseClient';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormData } from '@/models/formdata';
import { AuthStackParamList } from '@/navigation_types/authstackparamlist';
import { RootStackParamList } from '@/navigation_types/rootstackparamlist';
import { loginScreenColor } from '@/colors/loginscreencolor';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Login: React.FC = (): React.JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const homeNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const { data: loginData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
            } else {
                Alert.alert('Welcome', `Hello ${loginData.user?.email}`, [
                    { text: 'OK', onPress: () => homeNavigation.navigate('AppTabs') },
                ]);
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'android' ? 'padding' : undefined}
        >
            <LinearGradient
                colors={loginScreenColor}
                className="flex-1 justify-center px-6"
            >
                <Box className="bg-white/90 rounded-3xl p-8 shadow-lg">
                    {/* Header */}
                    <Text className="text-3xl font-extrabold text-green-500 text-center mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-xl text-center text-green-600 mb-6">
                        Sign in to continue
                    </Text>

                    {/* Form */}
                    <VStack space="md">
                        {/* Email */}
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: 'Email is required',
                                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
                            }}
                            render={({ field: { onChange, value } }) => (
                                <Input size="lg" className="bg-gray-100 rounded-xl">
                                    <InputField
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </Input>
                            )}
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-sm">{errors.email.message}</Text>
                        )}

                        {/* Password */}
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            }}
                            render={({ field: { onChange, value } }) => (
                                <Input size="lg" className="bg-gray-100 rounded-xl flex-row items-center">
                                    <InputField
                                        placeholder="Password"
                                        secureTextEntry={!showPassword}
                                        value={value}
                                        onChangeText={onChange}
                                        className="flex-1"
                                    />
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="gray"
                                        style={{ marginLeft: 8 }}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                </Input>
                            )}
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-sm">{errors.password.message}</Text>
                        )}

                        {/* Login Button */}
                        <Button
                            size="lg"
                            className="mt-2 bg-green-600 rounded-xl py-3"
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                        >
                            <ButtonText className="text-white font-bold">
                                {loading ? 'Logging in...' : 'Login'}
                            </ButtonText>
                        </Button>
                    </VStack>

                    {/* Footer */}
                    <Box className="mt-6 items-center">
                        <Text className="text-lg text-blue-600">
                            Don’t have an account?{' '}
                            <Text
                                className="text-green-700 text-lg font-semibold"
                                onPress={() => navigation.navigate('Register')}
                            >
                                Register
                            </Text>
                        </Text>
                    </Box>
                </Box>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export default Login;
