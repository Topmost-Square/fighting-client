import {useNavigate} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";
import {useLoginMutation} from "../generated/graphql";
import {ApolloError} from "@apollo/client";
import {saveToken} from "../utils/auth";

export const Login = () => {
    type LoginForm = {
        email: string
        password: string
    }

    const navigate = useNavigate();

    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
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

    const [submitLogin, { error, loading }] = useLoginMutation();

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
            const loginResponse = await submitLogin({
                variables: {
                    ...form
                },
                context: {
                    clientName: 'auth'
                }
            });

            if (loginResponse.data?.login) {
                saveToken(
                    loginResponse!.data!.login!.token as string
                )
                navigate('/');
            } else {
                setErrorFields([
                    'email'
                ]);
                setErrors([
                    "Sorry, our elves didn't manage to log you in"
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
                        Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitForm}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
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
                                className={(errorFields.includes('password') ? "border-red-600 " : '') + "relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"}
                                placeholder="Password"
                                value = {form.password}
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
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"/>
            </svg>
          </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
