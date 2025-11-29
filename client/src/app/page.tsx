import { Header } from "@/components/Header/Header";
import { Metrics } from "@/components/Metrics/Metrics";
import { SelectProject } from "@/components/SelectProject/SelectProject";


export default function Home() {
    return (
        <>
            <Header />
            <SelectProject />
            <Metrics />
        </>
    );
}
