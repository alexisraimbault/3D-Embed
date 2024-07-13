import './styles.scss'

import React, { useEffect, useState } from "react";
import EasyCropper, { Area } from 'react-easy-crop';
import { useAuth } from '@kobbleio/next/client';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from 'primereact/button';

import { getCroppedImg, readFile } from '@utils/methods';
import { storage } from '@utils/firebase';

export const ImageCrop = ({ imageName, setImageName }: {
    imageName: string, setImageName: (s: string) => void
}) => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [tempImg, setTempImg] = useState('')
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const [firebaseImageUrl, setFirebaseImageUrl] = useState('')

    useEffect(() => {
        if (imageName && imageName.length > 0) {
            fetchImage()
        }
    }, [imageName])

    const fetchImage = async () => {
        const imagePath = `uploads/${imageName}`
        const imageUrlRes = await getDownloadURL(ref(storage, imagePath));
        setFirebaseImageUrl(imageUrlRes)
    }

    const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    };

    const handleFileChange = async ({ target: { files } }: { target: { files: FileList | null } }) => {
        const file = files && files[0];
        if (file === null || file === undefined) {
            return
        }
        const imageDataUrl: string = await readFile(file);
        setTempImg(imageDataUrl);
        setIsModalOpen(true);
    };

    const getProcessedImage = async () => {
        if (!tempImg || !croppedAreaPixels) {
            return
        }
        const croppedImage: { file: Blob, url: string } | null = await getCroppedImg(tempImg, croppedAreaPixels);
        if (croppedImage === null || croppedImage === undefined) {
            return
        }

        // const imageFile = new File([croppedImage.file], `img-${Date.now()}.png`, {
        // type: 'image/png'
        // });
        return croppedImage;
    };

    const onUploadImage = async (image: Blob) => {
        if (!image) {
            return;
        }

        const userId = user?.id || undefined
        if (!userId) {
            return
        }

        const imageName = `${userId}_${Date.now()}`
        const storageRef = ref(storage, `uploads/${imageName}`);
        await uploadBytes(storageRef, image);
        setImageName(imageName)
    }

    const onSaveImage = async () => {
        const imageData: { file: Blob, url: string } | undefined = await getProcessedImage()
        if (!imageData) {
            return
        }
        onUploadImage(imageData.file)
        setIsModalOpen(false)
    }

    return (
        <div className="image-crop__wrapper">
            <input
                type="file"
                onChange={handleFileChange}
                className="image-crop__hidden"
                id="avatarInput"
                accept="image/*"
            />
            {!isModalOpen && (
                <label
                    htmlFor="avatarInput"
                    className="image-crop__image-container"
                >
                    <img
                        src={firebaseImageUrl}
                        height={192}
                        width={192}
                        className="image-crop__image-preview"
                        alt=""
                    />
                </label>
            )}
            {isModalOpen && (
                <div className="image-crop__crop-container">
                    <EasyCropper
                        image={tempImg || undefined}
                        crop={crop}
                        zoom={zoom}
                        cropShape="rect"
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        //   showGrid={false}
                        //   cropSize={{ width: 185, height: 185 }}
                        style={{
                            containerStyle: {
                                height: 220,
                                width: 220,
                                top: 8,
                                bottom: 8,
                                left: 8,
                                right: 8
                            }
                        }}
                    />
                    <div className="image-crop__controls">
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            onClick={onSaveImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};