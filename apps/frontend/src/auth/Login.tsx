import axios from "axios"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@repo/backend-common/config";
import { Link } from "react-router-dom";
import { login } from "./auth";

type FormData = {
    email: string;
    password: string;
    
};

export default function Login() {
  
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: { email: "", password: "" },
        resolver: zodResolver(loginSchema)
    },)

    async function onSubmit(data: FormData) {
        try {
            await login(data.email, data.password)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Chat
                    </h1>
                    <p className="mt-2 text-gray-400">Create your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-left text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500 text-left">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-left text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create password"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500 text-left">{errors.password.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                        Create an Account?{" "}
                        <Link to={"/signup"} className="font-medium text-blue-400 hover:text-blue-300">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}