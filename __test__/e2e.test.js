let Plasma = require('organic-plasma')
let FlushCellsOrganelle = require('../organelles/flush-cells')

test('apoptosis cell', () => {
  let plasma = new Plasma()
  let dna = {

  }
  let instance = new FlushCellsOrganelle(plasma, dna)
  instance.onCellMitosisComplete({
    cellInfo: {
      name: 'test',
      version: '1.0.0',
      mitosis: {
        apoptosis: {
          versionConditions: ['major', 'minor', 'patch', 'prerelease']
        }
      }
    }
  })
  instance.onCellMitosisComplete({
    cellInfo: {
      name: 'test',
      version: '2.0.0-feature1',
      mitosis: {
        apoptosis: {
          versionConditions: ['prerelease']
        }
      }
    }
  })
  instance.onCellMitosisComplete({
    cellInfo: {
      name: 'test',
      version: '2.0.0-feature2',
      mitosis: {
        apoptosis: {
          versionConditions: ['major', 'minor', 'patch', 'prerelease']
        }
      }
    }
  })
  instance.onCellMitosisComplete({
    cellInfo: {
      name: 'test',
      version: '2.0.0',
      mitosis: {
        apoptosis: {
          versionConditions: ['major']
        }
      }
    }
  })
  instance.onCellMitosisComplete({
    cellInfo: {
      name: 'test',
      version: '2.0.1',
      mitosis: {
        apoptosis: {
          versionConditions: ['major']
        }
      }
    }
  })
  expect(instance.startedCells.length).toBe(2)
})
