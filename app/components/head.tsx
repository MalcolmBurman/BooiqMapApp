export function Head(props: { title: string, subtitle: string }) {
    return (<>
        <div className="text-3xl">{props.title}</div>
        <p>{props.subtitle}</p>


    </>);
}