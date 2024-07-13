import './styles.scss'

import { PopoverPicker } from '../kit/ColorPicker';
// import { Slider } from 'primereact/slider';
// import { Slider } from "@nextui-org/slider";
// import { Slider } from "@nextui-org/slider";
// import { Checkbox } from 'primereact/checkbox';
import { Slider } from '@mui/base/Slider';
import { Nullable } from "primereact/ts-helpers";
import { Button } from 'primereact/button';

import { projectType, shapeSettingsType } from '@utils/types';
import { settingsParamsByShape } from '@utils/statics';
import { ImageCrop } from '../kit/ImageCrop';

type EditorRightSidebarPropsTypes = {
    onUpdateShapeSettings: (s: shapeSettingsType) => void,
    onResetDefaultSettings: () => void,
    projectData: projectType,
};

const EditorRightSidebar = ({
    onUpdateShapeSettings,
    onResetDefaultSettings,
    projectData,
}: EditorRightSidebarPropsTypes) => {

    const updateColor = (index: number) => (newColor: string) => {
        const newProjectData = { ...projectData }
        newProjectData.shapeSettings.colors[index] = newColor
        onUpdateShapeSettings(newProjectData.shapeSettings)
    }

    const updateMetric = (index: number) => (newMetric: Nullable<number | null> | number[]) => {
        if (newMetric === null || newMetric === undefined) {
            return
        }
        if (Array.isArray(newMetric)) {
            return;
        }
        if (!newMetric && newMetric !== 0) {
            return
        }

        const newProjectData = { ...projectData }
        newProjectData.shapeSettings.metrics[index] = newMetric
        onUpdateShapeSettings(newProjectData.shapeSettings)
    }

    const updateImage = (index: number) => (newImage: string) => {
        const newProjectData = { ...projectData }
        newProjectData.shapeSettings.images[index] = newImage
        onUpdateShapeSettings(newProjectData.shapeSettings)
    }

    const renderColorSettings = (index: number, defaultColor: string) => {

        return (
            <div className='right-sidebar__color-picker-wrapper'>
                <PopoverPicker
                    color={projectData.shapeSettings.colors[index] || defaultColor}
                    onChange={updateColor(index)}
                />
            </div>
        )
    }

    const renderMetrcSettings = (index: number, defaultValue: number, minValue: number, maxValue: number, step: number, label: string) => {
        const value = projectData.shapeSettings.metrics[index] || defaultValue

        // const isCheckbox = minValue === 0 && maxValue === 1 && step === 1
        return (
            <div className='right-sidebar__slider-wrapper'>
                {/* {!isCheckbox && ( */}
                <Slider
                    value={value}
                    step={step}
                    max={maxValue}
                    min={minValue}
                    onChange={(_e, value) => updateMetric(index)(value)}
                    className='right-sidebar__slider'
                // defaultValue={0.4}
                />
                {/* )} */}
                {/* {isCheckbox && (
                    <Checkbox
                        onChange={e => {
                            console.log(e.checked ? 1 : 0)
                            updateMetric(index)(e.checked ? 1.0 : 0.0)
                        }}
                        checked={value === 1}
                    >
                    </Checkbox>
                )} */}
                {/* <Slider
                    value={value}
                    onChange={(e) => updateMetric(index)(e.value)}
                    min={minValue}
                    max={maxValue}
                    step={step}
                    className='right-sidebar__slider'
                /> */}
                <div className='right-sidebar__slider-value'>
                    {value}
                </div>
            </div>
        )
    }

    const renderImageSettings = (index: number, defaultImage: string) => {

        return (
            <div className='right-sidebar__image-input-wrapper'>
                <ImageCrop
                    imageName={projectData.shapeSettings.images[index] || defaultImage}
                    setImageName={updateImage(index)}
                />
            </div>
        )

    }

    const availableSettingsTypes = Object.keys(settingsParamsByShape)
    const settingsToRender = availableSettingsTypes.includes(projectData.shape || '') ? settingsParamsByShape[projectData.shape || ''] : []

    return (
        <div className="right-sidebar__wrapper">
            <div className='right-sidebar__header'>
                {"Customisation"}
            </div>
            {settingsToRender.map(({ type,
                index,
                defaultValue,
                min,
                max,
                step,
                label,
            }) => {
                const isColor = type === 'color'
                const isMetric = type === 'metric'
                const isImage = type === 'image'
                return (
                    <div
                        className='right-sidebar__setting-wrapper'
                        key={
                            `s-${isColor ? 'c' :
                                isMetric ? 'm' :
                                    isImage ? 'i' : '?'
                            }-${index}`
                        }
                    >
                        {label && label.length > 0 && (
                            <div className='right-sidebar__setting-label'>
                                {label}
                            </div>
                        )}
                        {isColor && renderColorSettings(index, defaultValue.toString())}
                        {isMetric && renderMetrcSettings(
                            index,
                            typeof defaultValue === 'number' ? defaultValue : 0,
                            min || 0,
                            max || 20,
                            step || 1,
                            label || 'Metric'
                        )}
                        {isImage && renderImageSettings(index, defaultValue.toString())}
                    </div>
                )
            })}
            {projectData.shape && projectData.shape.length > 0 && (
                <Button
                    label="Reset"
                    icon="pi pi-undo"
                    onClick={onResetDefaultSettings}
                />
            )}
        </div>
    );
}

export default EditorRightSidebar