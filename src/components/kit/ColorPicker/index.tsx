import './styles.scss'

import React from "react";
import { ColorPicker, ColorPickerHSBType, ColorPickerRGBType } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

export const PopoverPicker = ({ color, onChange }: {
    color: string, onChange: (s: string) => void
}) => {

    const onUpdateTextColor = (newColor: string | null | undefined | ColorPickerHSBType | ColorPickerRGBType) => {
        if (newColor === null) {
            return
        }
        if (newColor === undefined) {
            return
        }
        if (newColor.toString().length > 6) {
            return
        }

        onChange(newColor.toString())
    }

    return (
        <div className="color-picker__wrapper">
            <ColorPicker
                format="hex"
                value={color}
                onChange={(e) => onUpdateTextColor(e.value)}
            />
            <div
                className='color-picker__icon-field'
            >
                <span className="pi pi-hashtag color-picker__icon" />
                <InputText
                    value={color}
                    onChange={(e) => onUpdateTextColor(e.target.value)}
                    placeholder="FFFFFF"
                    className='color-picker__input'
                />
            </div>
        </div>
    );
};