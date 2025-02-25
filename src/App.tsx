import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

const deployMessage = async (data: FormData) => {
  // const response = await fetch("http://localhost:8000/api/deploy", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // return response.json();

  //return a fake success
  return { message: data.message };
};

function App() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Log In</button>;
  }

  const mutation = useMutation({ mutationFn: deployMessage });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // const onSubmit = (data: FormData) => {
  //   console.log("Form submitted:", data);
  // };

  return (
    <div>
      <h1>Hello World Configurator</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("message")} placeholder="Enter a message" />
        {errors.message && <p>{errors.message.message}</p>}
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Deploying..." : "Deploy"}
        </button>
      </form>
      {mutation.isSuccess && <p>Deployed: {mutation.data.message}</p>}
    </div>
  );
}

export default App;
