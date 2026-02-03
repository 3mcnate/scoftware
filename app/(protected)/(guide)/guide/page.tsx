import { redirect } from "next/navigation";

export default function GuideHomePage()
{
	return redirect('/guide/my-trips');
}