import './styles.scss'

import { useState } from "react";
import ReactGPicker from 'react-gcolor-picker';
import Image from 'next/image'

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

    const renderImage = (imagePath: string, imageAlt: string = "") => {
        return (
            <Image
                className='left-sidebar__feature-img'
                src={imagePath}
                height={150}
                width={150}
                alt="imageAlt"
            />
        )
    }

    const ThreeDAssets = [
        {
            id: 'imageParticles',
            // render: (
            //     <ImageParticles isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_1.png')
        },
        {
            id: 'ballpit',
            // render: (
            //     <BallPit isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_2.png')
        },
        {
            id: 'xmasBallpit',
            // render: (
            //     <XMasBallpit isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_3.png')
        },
        {
            id: 'perlin',
            // render: (
            //     <PerlinBlob isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_4.png')
        },
        {
            id: 'network',
            // render: (
            //     <Network isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_5.png')
        },
        {
            id: 'planet',
            // render: (
            //     <Planet isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_6.png')
        },
        {
            id: 'morph',
            // render: (
            //     <MorphBlob isSidebar />
            // )
            render: renderImage('/assets/features_screenshots/screen_7.png')
        },
    ]

    return (
        <div className="left-sidebar__wrapper">
            <div className="left-sidebar__tabs-wrapper">
                {tabElements.map((item, index) => {
                    return (
                        <div
                            className={`left-sidebar__tab-title${selectedTab === index ? " left-sidebar__tab-title--selected" : ""}`}
                            key={`t-${index}`}
                            onClick={() => setSelectedTab(index)}
                        >
                            <span className={`${item.icon} left-sidebar__tab-icon`} />
                            {item.label}
                        </div>
                    )
                })}
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
                    <ReactGPicker
                        value={backgroundColor}
                        onChange={setBackgroundColor}
                        gradient
                    />
                )}
            </div>
        </div>
    );
}

export default EditorLeftSidebar