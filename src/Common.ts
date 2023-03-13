export const makeArray = (olders: string | any[], items: any[], empty: any = { x: 0, y: 0, width: 0, height: 0 }) => {
  if (items instanceof Array) {
    return items.map((item, index) => {
      return index < olders.length ? olders[index] : empty
    })
  } else if (items) return [olders.length > 0 ? olders[0] : empty]
  return []
}

export const isEqualLayout = (obj1: any, obj2: any) => {
  return obj1.x === obj2.x && obj1.y === obj2.y && obj1.width === obj2.width && obj1.height === obj2.height
}

export function styleArrayToJson (arr: any) {
  let json = {}
  arr.map((item: any) => {
    json = Object.assign(json, item)
  })
  return json
}
