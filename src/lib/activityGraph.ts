// Renders the same SVG that github-readme-activity-graph.vercel.app used to serve, entirely client-side.
// The chart templates and the chartist options below are copied verbatim from
// https://github.com/Ashutosh00710/github-readme-activity-graph (MIT) so the output is identical;
// only the data source changed (github-contributions-api.jogruber.de instead of GitHub GraphQL).

export interface Colors {
    areaColor: string;
    bgColor: string;
    borderColor: string;
    color: string;
    titleColor?: string;
    lineColor: string;
    pointColor: string;
}

interface GraphArgs {
    width: number;
    height: number;
    radius: number;
    colors: Colors;
    title: string;
    line: string;
}

export interface ContributionDay {
    date: string;
    contributionCount: number;
}

const graphStyle = (color: string, line: string, point: string, area: string) =>
    `
    .ct-label {
      fill: #${color};
      color: #${color};
      font-size: .75rem;
      line-height: 1;
    }

    .ct-grid-background,
    .ct-line {
      fill: none;
    }

    .ct-chart-bar .ct-label,
    .ct-chart-line .ct-label {
      display: block;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
    }

    .ct-label.ct-horizontal.ct-start {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-label.ct-horizontal.ct-end {
      -webkit-box-align: flex-start;
      -webkit-align-items: flex-start;
      -ms-flex-align: flex-start;
      align-items: flex-start;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-label.ct-vertical.ct-start {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-end;
      -webkit-justify-content: flex-end;
      -ms-flex-pack: flex-end;
      justify-content: flex-end;
      text-align: right;
      text-anchor: end;
    }

    .ct-label.ct-vertical.ct-end {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-grid {
      stroke: #${color};
      stroke-width: 1px;
      stroke-opacity: 0.3;
      stroke-dasharray: 2px;
    }

    .ct-point {
      stroke-width: 10px;
      stroke-linecap: round;
      stroke: #${point};
      animation: blink 1s ease-in-out forwards;
    }

    .ct-line {
      stroke-width: 4px;
      stroke-dasharray: 5000;
      stroke-dashoffset: 5000;
      stroke: #${line};
      animation: dash 5s ease-in-out forwards;
    }

    .ct-area {
      stroke: none;
      fill-opacity: 0.1;
    }

    .ct-series-a .ct-area,
    .ct-series-a .ct-slice-pie {
      fill: #${area};
    }

    .ct-label .ct-horizontal {
      transform: rotate(-90deg)
    }
    `;

const pointAnimation = () =>
    `
        @keyframes blink {
            from {
                opacity: 0;
                transform:translateX(-20px); 
            }
            to {
                opacity:1;
                transform: translateX(0);
            }
        }
    `;

const lineAnimation = () =>
    `
        @keyframes dash {
            to {
                stroke-dashoffset: 0;
            }
        }
    
    `;

const graphSvg = (props: GraphArgs) => `
    <svg
        width="${props.width}"
        height="${props.height}"
        viewBox="0 0 ${props.width} ${props.height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
            <rect xmlns="http://www.w3.org/2000/svg" data-testid="card_bg" id="cardBg"
            x="0" y="0" rx="${props.radius}" height="100%" stroke="#E4E2E2" fill-opacity="1"
            width="100%" fill="#${props.colors.bgColor}" stroke-opacity="1" style="stroke:#${
                props.colors.borderColor
            }; stroke-width:1;"/>

            <style>
                body {
                    font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
                }
                .header {
                    font: 600 20px 'Segoe UI', Ubuntu, Sans-Serif;
                    text-align: center;
                    color: #${props.colors.titleColor ?? props.colors.color};
                    margin-top: 20px;
                }
                svg {
                    font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
                    user-select: none;
                }
                ${graphStyle(
                    props.colors.color,
                    props.colors.lineColor,
                    props.colors.pointColor,
                    props.colors.areaColor,
                )}
                ${pointAnimation()}
                ${lineAnimation()}
            </style>

            <foreignObject x="0" y="0" width="${props.width}" height="50">
                <h1 xmlns="http://www.w3.org/1999/xhtml" class="header">
                    ${props.title}
                </h1>
            </foreignObject>
            ${props.line}
    </svg>
`;

// Same selection as the original fetcher: the last `days` days up to today,
// dropping today while it still has no contributions. Labels are the day of month.
export function selectRecentDays(
    contributions: { date: string; count: number }[],
    days = 31,
): ContributionDay[] {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const recent = contributions
        .filter((day) => day.date <= tomorrow)
        .slice(-(days + 2))
        .map((day) => ({
            date: String(Number(day.date.slice(8, 10))),
            contributionCount: day.count,
        }));
    if (recent.length && recent[recent.length - 1].contributionCount === 0) recent.pop();
    return recent.slice(-days);
}

// Mirrors node-chartist: foreignObject labels disabled, axis titles added after render.
async function renderLineChart(options: any, data: any): Promise<string> {
    const { default: Chartist } = await import('chartist');
    const isSupported = Chartist.Svg.isSupported;
    Chartist.Svg.isSupported = (feature: string) =>
        ['Extensibility', 'AnimationEventsAttribute'].includes(feature) ? false : isSupported(feature);

    const container = document.createElement('div');
    const chart = new Chartist.Line(container, data, options);
    const event: any = await new Promise((resolve) => chart.on('created', resolve));
    Chartist.Svg.isSupported = isSupported;

    const { chartPadding, axisX, axisY } = chart.options;
    const text = (attr: Record<string, string | number>, content: string) => {
        const el = new Chartist.Svg('text');
        el.addClass('ct-axis-title ct-label');
        el.attr(attr);
        el.text(content);
        chart.svg.append(el);
    };
    if (axisX.title) {
        text(
            {
                x: chartPadding.left + (axisY.position === 'start' ? axisY.offset : 0) + event.axisX.axisLength / 2,
                y: chartPadding.top + (axisX.position === 'start' ? 0 : event.axisY.axisLength + axisX.offset),
                'dominant-baseline': axisX.position === 'start' ? 'hanging' : 'text-after-edge',
                'text-anchor': 'middle',
            },
            axisX.title,
        );
    }
    if (axisY.title) {
        const x = chartPadding.left + (axisY.position === 'start' ? 0 : event.axisX.axisLength + axisY.offset);
        const y = chartPadding.top + (axisX.position === 'start' ? axisX.offset : 0) + event.axisY.axisLength / 2;
        text(
            {
                x,
                y,
                transform: `rotate(${axisY.position === 'start' ? -90 : 90}, ${x}, ${y})`,
                'dominant-baseline': axisY.position === 'start' ? 'hanging' : 'text-after-edge',
                'text-anchor': 'middle',
            },
            axisY.title,
        );
    }
    chart.detach();
    // node-chartist's jsdom never serialized the inline size style browsers add; drop it to match
    return container.innerHTML.replace(/^(<svg[^>]*?) style="[^"]*"/, '$1');
}

export async function buildActivityGraph(
    days: ContributionDay[],
    colors: Colors,
    title: string,
    { width = 1200, height = 420, radius = 0, area = false, showGrid = true } = {},
): Promise<string> {
    const options = {
        width,
        height,
        axisY: {
            title: 'Contributions',
            onlyInteger: true,
            offset: 70,
            labelOffset: {
                y: 4.5,
            },
            low: 0,
            showGrid,
        },
        axisX: {
            title: 'Days',
            offset: 50,
            labelOffset: {
                x: -4.5,
            },
            showGrid,
        },
        chartPadding: {
            top: 80,
            right: 50,
            bottom: 20,
            left: 20,
        },
        showArea: area,
        fullWidth: true,
    };

    const line = await renderLineChart(options, {
        labels: days.map((day) => day.date),
        series: [{ value: days.map((day) => day.contributionCount) }],
    });

    return graphSvg({ width, height, colors, title, radius, line });
}
