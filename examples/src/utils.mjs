export function getEnabledFiltersFromQueryString()
{
    const params = new URLSearchParams(window.location.search);

    if (!params.has('enabled'))
    {
        return [];
    }

    return params.get('enabled').split(',');
}

export function createTransparencyTexture(app, side, colorA, colorB)
{
    const texture = PIXI.RenderTexture.create({
        width: side,
        height: side,
    });
    const halfSide = side / 2;

    app.renderer.render({
        target: texture,
        container: new PIXI.Container({
            children: [
                new PIXI.Sprite({
                    texture: PIXI.Texture.WHITE,
                    tint: colorA,
                    width: halfSide,
                    height: halfSide,
                    x: 0,
                    y: 0,
                }),
                new PIXI.Sprite({
                    texture: PIXI.Texture.WHITE,
                    tint: colorB,
                    width: halfSide,
                    height: halfSide,
                    x: halfSide,
                    y: 0,
                }),
                new PIXI.Sprite({
                    texture: PIXI.Texture.WHITE,
                    tint: colorB,
                    width: halfSide,
                    height: halfSide,
                    x: 0,
                    y: halfSide,
                }),
                new PIXI.Sprite({
                    texture: PIXI.Texture.WHITE,
                    tint: colorA,
                    width: halfSide,
                    height: halfSide,
                    x: halfSide,
                    y: halfSide,
                }),
            ]
        })
    });

    return texture;
}

