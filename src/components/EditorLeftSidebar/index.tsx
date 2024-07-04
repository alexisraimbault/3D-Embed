import './styles.scss'

import { useState } from "react";
import { TabMenu } from 'primereact/tabmenu';
import ColorPicker from 'react-best-gradient-color-picker'

import {
    MorphBlob,
    Network,
    PerlinBlob,
    Planet
} from "@components"

type EditorLeftSidebarPropsTypes = {
    onUpdateShape: (shape: string) => void,
    seletedShape: string | null,
    backgroundColor: string,
    setBackgroundColor: (s: string) => void,
};

const EditorLeftSidebar = ({
    onUpdateShape,
    seletedShape,
    backgroundColor,
    setBackgroundColor,
}: EditorLeftSidebarPropsTypes) => {
    const [selectedTab, setSelectedTab] = useState(0)

    const tabElements = [
        {
            label: 'Shapes',
            icon: 'pi pi-sparkles'
        }, {
            label: 'Background',
            icon: 'pi pi-stop'
        }
    ]

    const ThreeDAssets = [
        {
            id: 'morph',
            render: (
                <MorphBlob />
            )
        },
        {
            id: 'network',
            render: (
                <Network />
            )
        },
        {
            id: 'perlin',
            render: (
                <PerlinBlob />
            )
        },
        {
            id: 'planet',
            render: (
                <Planet />
            )
        },
    ]

    return (
        <div className="left-sidebar__wrapper">
            <div className="left-sidebar__tabs__wrapper">
                <TabMenu model={tabElements} activeIndex={selectedTab} onTabChange={(e) => setSelectedTab(e.index)} />
                {/* {tabs.map(({ id: tabId, element: tabElement }) => (
                    <div
                        className={`left-sidebar__tabs__tab${selectedTab === tabId ? ' left-sidebar__tabs__tab--selected' : ''}`}
                        key={`t-${tabId}`}
                        onClick={() => setSelectedTab(tabId)}
                    >
                        {tabElement}
                    </div>
                ))} */}
            </div>
            <div className="left-sidebar__inner">
                <div className={`left-sidebar__shapes${selectedTab !== 0 ? ' left-sidebar__shapes--hidden' : ''}`}>
                    {ThreeDAssets.map(({ id, render }) => (
                        <div
                            key={`a-${id}`}
                            onClick={() => onUpdateShape(id)}
                            className={`left-sidebar__shape${id === seletedShape ? ' left-sidebar__shape--selected' : ''}`}
                        >
                            {render}
                        </div>
                    ))}
                </div>
                {selectedTab === 1 && (
                    <>
                        <ColorPicker value={backgroundColor} onChange={setBackgroundColor} />
                    </>
                )}
            </div>

        </div>
    );
}

export default EditorLeftSidebar