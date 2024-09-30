export default function playerImgPath (name: string) {
    const imgPath = name.replace(' ', '_').toLowerCase();
    return imgPath;
}