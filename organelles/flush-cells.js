const fs = require('fs')
const semverDiff = require('semver-diff')
const StartedCells = require('organic-alchemy-started-cells-info')

module.exports = class {
  constructor (plasma, dna) {
    this.plasma = plasma
    this.dna = dna
    this.plasma.on('onCellMitosisComplete', this.onCellMitosisComplete, this)
    this.startedCells = new StartedCells()
  }
  onCellMitosisComplete (c, next) {
    let cellInfo = c.cellInfo
    this.startedCells.forEach((legacy_cell) => {
      if (legacy_cell.name === cellInfo.name &&
        is_version_legacy(legacy_cell.mitosis.apoptosis.versionConditions, legacy_cell.version, cellInfo.version)) {
        console.info('flushing', legacy_cell)
        this.startedCells.remove(legacy_cell)
        if (c.path) {
          fs.unlink(c.path, (err) => {
            if (err) console.info(err, c.path)
          })
        }
      }
    })
    this.startedCells.add(cellInfo)
  }
}
const is_version_legacy = function (versionConditions, existing_version, new_version) {
  let diffValue = semverDiff(existing_version, new_version)
  return versionConditions.indexOf(diffValue) !== -1
}
