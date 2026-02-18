const zAxis = new THREE.Vector3(0, 0, 1)
const degToRad = THREE.Math.degToRad
const tempQuaternion = new THREE.Quaternion()

function normalFromTangent (tangent) {
  const lineEnd = new THREE.Vector3(0, 1, 0)
  tempQuaternion.setFromUnitVectors(zAxis, tangent)
  lineEnd.applyQuaternion(tempQuaternion)
  return lineEnd
}

export const Curve = {
  // dependencies: ['curve-point'],
  schema: {
    type: {
      type: 'string',
      default: 'CatmullRom',
      oneOf: ['CatmullRom', 'CubicBezier', 'QuadraticBezier', 'Line']
    },
    closed: {
      type: 'boolean',
      default: false
    }
  },

  init: function () {
    this.pathPoints = null
    this.curve = null

    this.el.addEventListener('curve-point-change', this.update.bind(this))
  },

  update: function (oldData) {
    this.points = Array.from(this.el.querySelectorAll('a-curve-point, [curve-point]'))

    if (this.points.length <= 1) {
      console.warn('At least 2 curve-points needed to draw a curve')
      this.curve = null
    } else {
      // Get Array of Positions from Curve-Points
      const pointsArray = this.points.map(function (point) {
        if (point.x !== undefined && point.y !== undefined && point.z !== undefined) {
          return point
        }

        return point.object3D.getWorldPosition(point.object3D.position)
      })

      // Update the Curve if either the Curve-Points or other Properties changed
      if (!AFRAME.utils.deepEqual(pointsArray, this.pathPoints) || (oldData !== 'CustomEvent' && !AFRAME.utils.deepEqual(this.data, oldData))) {
        this.curve = null

        this.pathPoints = pointsArray

        // Create Curve
        switch (this.data.type) {
          case 'CubicBezier':
            if (this.pathPoints.length !== 4) {
              console.warn('The Three constructor of type CubicBezierCurve3 requires 4 points')
              return
            }
            this.curve = new THREE.CubicBezierCurve3(this.pathPoints[0], this.pathPoints[1], this.pathPoints[2], this.pathPoints[3])
            break
          case 'QuadraticBezier':
            if (this.pathPoints.length !== 3) {
              console.warn('The Three constructor of type QuadraticBezierCurve3 requires 3 points')
              return
            }
            this.curve = new THREE.QuadraticBezierCurve3(this.pathPoints[0], this.pathPoints[1], this.pathPoints[2])
            break
          case 'Line':
            if (this.pathPoints.length !== 2) {
              console.warn('The Three constructor of type LineCurve3 requires 2 points')
              return
            }
            this.curve = new THREE.LineCurve3(this.pathPoints[0], this.pathPoints[1])
            break
          case 'CatmullRom':
            this.curve = new THREE.CatmullRomCurve3(this.pathPoints)
            break
          default:
            throw new Error('No Three constructor of type (case sensitive): ' + this.data.type + 'Curve3')
        }

        this.curve.closed = this.data.closed

        this.el.emit('curve-updated')
      }
    }
  },

  remove: function () {
    this.el.removeEventListener('curve-point-change', this.update.bind(this))
  },

  closestPointInLocalSpace: function closestPoint (point, resolution, testPoint, currentRes) {
    if (!this.curve) throw Error('Curve not instantiated yet.')
    resolution = resolution || 0.1 / this.curve.getLength()
    currentRes = currentRes || 0.5
    testPoint = testPoint || 0.5
    currentRes /= 2
    const aTest = testPoint + currentRes
    const bTest = testPoint - currentRes
    const a = this.curve.getPointAt(aTest)
    const b = this.curve.getPointAt(bTest)
    const aDistance = a.distanceTo(point)
    const bDistance = b.distanceTo(point)
    const aSmaller = aDistance < bDistance
    if (currentRes < resolution) {
      const tangent = this.curve.getTangentAt(aSmaller ? aTest : bTest)
      if (currentRes < resolution) {
        return {
          result: aSmaller ? aTest : bTest,
          location: aSmaller ? a : b,
          distance: aSmaller ? aDistance : bDistance,
          normal: normalFromTangent(tangent),
          tangent
        }
      }
    }
    if (aDistance < bDistance) {
      return this.closestPointInLocalSpace(point, resolution, aTest, currentRes)
    } else {
      return this.closestPointInLocalSpace(point, resolution, bTest, currentRes)
    }
  }
}

export const CurvePoint = {
  // dependencies: ['position'],

  schema: {},

  init: function () {
    this.el.addEventListener('componentchanged', this.changeHandler.bind(this))
    this.el.emit('curve-point-change')
  },

  changeHandler: function (event) {
    if (event.detail.name === 'position') {
      this.el.emit('curve-point-change')
    }
  }
}

export const DrawCurve = {

  // dependencies: ['curve', 'material'],

  schema: {
    curve: { type: 'selector' }
  },

  init () {
    this.data.curve.addEventListener('curve-updated', this.update.bind(this))
  },

  update () {
    if (this.data.curve) {
      this.curve = this.data.curve.components.curve
    }

    if (this.curve && this.curve.curve) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(this.curve.curve.getPoints(this.curve.curve.getPoints().length * 10))
      const mesh = this.el.getObject3D('mesh')
      const lineMaterial = mesh && mesh.material
        ? mesh.material
        : new THREE.LineBasicMaterial({
          color: '#ff0000'
        })

      this.el.setObject3D('mesh', new THREE.Line(lineGeometry, lineMaterial))
    }
  },

  remove () {
    this.data.curve.removeEventListener('curve-updated', this.update.bind(this))
    this.el.getObject3D('mesh').geometry.toBufferGeometry()
  }

}

export const CloneAlongCurve = {

  // dependencies: ['curve'],

  schema: {
    curve: { type: 'selector' },
    spacing: { default: 1 },
    rotation: {
      type: 'vec3',
      default: { x: 0, y: 0, z: 0 }
    },
    scale: {
      type: 'vec3',
      default: { x: 1, y: 1, z: 1 }
    }
  },

  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this))
    this.data.curve.addEventListener('curve-updated', this.update.bind(this))
  },

  update: function () {
    this.remove()

    if (this.data.curve) {
      this.curve = this.data.curve.components.curve
    }

    if (!this.el.getObject3D('clones') && this.curve && this.curve.curve) {
      const mesh = this.el.getObject3D('mesh')

      const length = this.curve.curve.getLength()
      const start = 0
      let counter = start

      this.el.setObject3D('clones', new THREE.Group())
      const cloneMesh = this.el.getObject3D('clones')

      const parent = new THREE.Object3D()
      mesh.scale.set(this.data.scale.x, this.data.scale.y, this.data.scale.z)
      mesh.rotation.set(degToRad(this.data.rotation.x), degToRad(this.data.rotation.y), degToRad(this.data.rotation.z))
      mesh.rotation.order = 'YXZ'

      parent.add(mesh)

      while (counter <= length) {
        const child = parent.clone(true)

        child.position.copy(this.curve.curve.getPointAt(counter / length))

        const tangent = this.curve.curve.getTangentAt(counter / length).normalize()

        child.quaternion.setFromUnitVectors(zAxis, tangent)

        cloneMesh.add(child)

        counter += this.data.spacing
      }
    }
  },

  remove: function () {
    this.curve = null
    if (this.el.getObject3D('clones')) {
      this.el.removeObject3D('clones')
    }
  }

}
