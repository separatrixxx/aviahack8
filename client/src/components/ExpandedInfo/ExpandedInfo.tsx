import styles from './ExpandedInfo.module.scss';
import cn from 'classnames';


interface ExpandedInfoProps {
    events: any[];
}

export const ExpandedInfo = (props: ExpandedInfoProps) => {
    const { events } = props;

    return (
        <>
            {events.map((e, i) => (
                <div key={i} className={cn(styles.expandedInfo, {
                    [styles.bad]: !e.isTarget,
                })}>
                    <div>
                        <b>{e.element}</b>
                        <span>{e.className}</span>
                        <span>{e.isTarget ? '🐞' : '—'} </span>
                    </div>
                    <span>Координаты: <b>({e.cursorCoords.x},{e.cursorCoords.y})</b></span>
                    {e.inlineStyles && (
                        `Инлайн-стили: ${e.inlineStyles}`
                    )}
                    <b>{e.meta.timestamp}</b>
                </div>
            ))}
        </>
    );
}