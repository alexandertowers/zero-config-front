import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";

const schema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

function App() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Log In</button>;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div>
      <h1>Hello World Configurator</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("message")} placeholder="Enter a message" />
        {errors.message && <p>{errors.message.message}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
