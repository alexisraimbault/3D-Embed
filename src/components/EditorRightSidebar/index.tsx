import './styles.scss'

import { PopoverPicker } from '../kit/ColorPicker';
import { Slider } from 'primereact/slider';
import { Nullable } from "primereact/ts-helpers";
import { Button } from 'primereact/button';

import { projectType, shapeSettingsType } from '@utils/types';
import { settingsParamsByShape } from '@utils/statics';

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
        if (!newMetric) {
            return
        }

        const newProjectData = { ...projectData }
        newProjectData.shapeSettings.metrics[index] = newMetric
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

    const renderMetrcSettings = (index: number, defaultValue: number, minValue: number, maxValue: number, step: number) => {
        const value = projectData.shapeSettings.metrics[index] || defaultValue

        return (
            <div className='right-sidebar__slider-wrapper'>
                <Slider
                    value={value}
                    onChange={(e) => updateMetric(index)(e.value)}
                    min={minValue}
                    max={maxValue}
                    step={step}
                    className='right-sidebar__slider'
                />
                <div className='right-sidebar__slider-value'>
                    {value}
                </div>
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
                return (
                    <div
                        className='right-sidebar__setting-wrapper'
                        key={`s-${isColor ?
                            'c' :
                            isMetric ? 'm' : '?'}-${index}`}
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
                            step || 1
                        )}
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