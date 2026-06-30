import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    themeVariables: {
        background: "#ffffff",
        primaryColor: "#f4f4f5",
        lineColor: "#71717a"
    }
});

// Robust sanitization function to fix LLM quirks safely
const sanitizeMermaidChart = (rawDiagram) => {
    if (!rawDiagram) return "";
    
    let clean = rawDiagram.replace(/\r\n/g, "\n").trim();
    
    // Ensure standard graph direction layout wrapper exists
    if (!clean.startsWith("graph") && !clean.startsWith("flowchart")) {
        clean = `graph TD\n${clean}`;
    }

    return clean
        .split('\n')
        .map(line => {
            let processedLine = line.trim();

            // 1. Remove trailing broken hyphens or standalone connector relics (e.g., "F -", "A --")
            processedLine = processedLine.replace(/\s+-[-\s]*$/, '');

            // 2. Safe Node Fixer: Auto-wrap raw bracket contents in quotes so special characters 
            // like parentheses "()" don't crash the parser.
            // Transforms: A[Text (I)] -> A["Text (I)"]  |  F{Decision Data} -> F{"Decision Data"}
            processedLine = processedLine.replace(/([A-Za-z0-9_-]+)\[([^"\n\]]+)\]/g, '$1["$2"]');
            processedLine = processedLine.replace(/([A-Za-z0-9_-]+)\{([^"\n}]+)\}/g, '$1{"$2"}');

            return processedLine;
        })
        .join('\n');
};

function MermaidSetup({ diagram }) {
    const containerRef = useRef(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!diagram || !containerRef.current) return;

        // Reset error state on incoming new diagram strings
        setHasError(false); 

        const uniqueId = `mermaid-${Math.floor(Math.random() * 1000000)}`;
        const safeChart = sanitizeMermaidChart(diagram);

        const renderDiagram = async () => {
            try {
                if (!containerRef.current) return;
                containerRef.current.innerHTML = ""; // Clear existing layout canvas

                // Render into virtual SVG node markup string
                const { svg } = await mermaid.render(uniqueId, safeChart);

                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (error) {
                console.error("Mermaid render failed natively:", error);
                setHasError(true);

                // Garbage Collection: Remove Mermaid's un-rendered ghost element from document body
                const ghostElement = document.getElementById(uniqueId);
                if (ghostElement) ghostElement.remove();
            }
        };

        renderDiagram();
    }, [diagram]);

    // Graceful fallback UI keeps your screen looking clean if the LLM output is totally un-parsable
    if (hasError) {
        return (
            <div className="w-full p-6 text-xs bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 italic text-center">
                ⚠️ Schematic map could not be compiled structurally. Review text definitions above.
            </div>
        );
    }

    return (
        <div className='bg-white rounded-xl p-4 overflow-x-auto flex justify-center items-center mix-blend-multiply w-full'>
            <div ref={containerRef} className="w-full flex justify-center" />
        </div>
    );
}

export default MermaidSetup;