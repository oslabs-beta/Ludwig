import React, { useEffect, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { ariaObject } from '../../../logic/aria-standards/aria-object';

function Doughnut({ recData }) {
    const colorPalette = useMemo(() => [
        'rgb(255, 140, 0)', 'rgb(72, 61, 139)', 'rgb(138, 51, 36)', 'rgb(47, 79, 79)',
        'rgb(219, 112, 147)', 'rgb(139, 69, 19)', 'rgb(154, 205, 50)', 'rgb(210, 105, 30)',
        'rgb(65, 105, 225)', 'rgb(222, 184, 135)', 'rgb(0, 206, 209)', 'rgb(250, 128, 114)',
        'rgb(34, 139, 34)', 'rgb(199, 21, 133)', 'rgb(205, 92, 92)', 'rgb(32, 178, 170)',
        'rgb(112, 128, 144)', 'rgb(255, 99, 71)'
    ], []);

    const backgroundColors = useMemo(() => {
        return Object.keys(recData).map((_, i) => colorPalette[i % colorPalette.length]);
    }, [recData, colorPalette]);

    const descriptions = useMemo(() => {
        return Object.keys(recData).map(key => ariaObject[key]?.desc || 'Unknown');
    }, [recData]);

    const data = useMemo(() => ({
        labels: descriptions,
        datasets: [{
            label: 'Critical Issues',
            data: Object.values(recData),
            backgroundColor: backgroundColors,
            hoverOffset: 4
        }]
    }), [descriptions, recData, backgroundColors]);

    useEffect(() => {
        const ctx = document.getElementById('doughnut').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [data]);

    return <canvas id='doughnut' width='400' height='400'></canvas>;
}

export default memo(Doughnut);