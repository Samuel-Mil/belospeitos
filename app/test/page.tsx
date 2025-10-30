import Gemini from "@/utils/gemini"

export default async function Test(){
    const ia = new Gemini();

    console.log("######################## Response da IA ########################");
    console.log(await ia.responseGenerator());

    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <p>Helo world</p>
        </div>
    )
}
