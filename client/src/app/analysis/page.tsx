'use client'
import { Anomalies } from "@/components/Anomalies/Anomalies";
import { SelectVisit } from "@/components/SelectVisit/SelectVisit";
import { Thinking } from "@/components/Thinking/Thinking";
import { useState } from "react";


export default function Analysis() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <>
            <SelectVisit setIsLoading={setIsLoading} />
            {
                isLoading ?
                    <Thinking />
                    : <Anomalies />
            }
        </>
    );
}
