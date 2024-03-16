"use client";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { Trash, ImagePlus } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
    }


const new_arr = ['https://res.cloudinary.com/dccotjnlu/image/upload/v1710580264/ftk2jqaxqkam7yanvngm.jpg','https://res.cloudinary.com/dccotjnlu/image/upload/v1710580264/ftk2jqaxqkam7yanvngm.jpg', 'https://res.cloudinary.com/dccotjnlu/image/upload/v1710580263/lqnkswiv6xtgticy8z1b.jpg']


const ImageUpload:React.FC<ImageUploadProps> = ({disabled, onChange, onRemove, value}) => {
    const [isMounted, setIsmounted] = useState(false);

    useEffect(()=>{
            setIsmounted(true);
    },[]);

    console.log("this is the value", value)


    const onUpload = (result: any) => {
            onChange(result.info.secure_url);

        }
    

    if (!isMounted) return null;

  
    return (
        <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          console.log("this is the url in the map function", url),
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="sm">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>

        <CldUploadWidget onSuccess={onUpload} uploadPreset="x1hh39nw">
            {({open})=>{
                const onClick = ()=>{
                    open();
                }
                return(
                   <Button
                   type="button"
                   disabled={disabled}
                   variant="secondary"
                   onClick={onClick}
                   >
                         
                         <ImagePlus className="h-4 w-4 mr-2"/>
                         Upload an Image
                   </Button>
                )
                   
              
                    
                    
            
            }}

        </CldUploadWidget>
    </div>
  )
}

export default ImageUpload;