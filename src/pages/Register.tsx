import {ChangeEvent, FormEvent, useState} from "react";
import { useRegisterMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";
import { ApolloError } from "@apollo/client";
import {saveToken} from "../utils/auth";

export const Register = () => {
    type RegisterForm = {
        email: string
        password: string
        confirmPassword: string
    }

    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorFields([]);
        setErrors([]);
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const [errors, setErrors] = useState<string[]>([])
    const [errorFields, setErrorFields] = useState<string[]>([])

    const [submitRegister, { error, loading }] = useRegisterMutation();

    const processGraphQLError = (e : ApolloError) => {
        const graphQLError: string = e.graphQLErrors[0].extensions.errorContent as string;
        const errorMessages: string[] = Object.values(graphQLError);
        const errorFieldsNames: string[] = Object.keys(graphQLError);
        setErrorFields([
            ...errorFieldsNames
        ]);
        setErrors([
            ...errorMessages
        ]);
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorFields([]);
        setErrors([]);

        try {
            const registerResponse = await submitRegister({
                variables: {
                    ...form
                }
            });

            if (registerResponse.data?.register) {
                saveToken(
                    registerResponse!.data!.register!.token as string
                )
                navigate('/');
            } else {
                setErrorFields([
                    'email'
                ]);
                setErrors([
                    "Sorry, our elves didn't manage to register your account"
                ]);
            }
        } catch (e: any) {
            if (e instanceof ApolloError) {
                processGraphQLError(e)
            }
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img className="mx-auto h-12 w-auto"
                         src="https://tailwindui.com/img/logos/mark.svg?color=black&shade=600" alt="Your Company" />
                        <h2
                            className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
                        >
                            Register
                        </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitForm}>
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div >
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={(errorFields.includes('email') ? "border-red-600 " : '') + "mb-1 relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"}
                                    placeholder="Email address"
                                    value = {form.email}
                                    onChange={onChangeInput}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className={(errorFields.includes('password') ? "border-red-600 " : '') + "mb-1 relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"}
                                    placeholder="Password"
                                    value = {form.password}
                                    onChange={onChangeInput}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className={(errorFields.includes('confirmPassword') ? "border-red-600 " : '') + "mt-1 relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"}
                                    placeholder="Repeat Password"
                                    value = {form.confirmPassword}
                                    onChange={onChangeInput}
                                />
                            </div>
                        </div>
                            { errors.length ?
                                errors.map(
                                    error => <p className='text-red-600'>{error}</p>
                                ) : ''
                            }
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your
                                    password?</a>
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                { loading ? 'loading...' : 'Register' }
                            </button>
                        </div>
                </form>
            </div>
        </div>
    );
}
