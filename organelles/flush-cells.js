const fs = require('fs')
const path = require('path')
const semverDiff = require('semver-diff')
const StartedCells = require('organic-alchemy-started-cells-info')

module.exports = class {
  constructor (plasma, dna) {
    this.plasma = plasma
    this.dna = dna
    this.plasma.on('onCellMitosisComplete', this.onCellMitosisComplete, this)
    this.plasma.on('onCellMitosisOffspring', this.onCellMitosisOffspring, this)
    this.startedCells = new StartedCells()
    this.flushOnOffspring = new StartedCells()
  }
  onCellMitosisOffspring (c) {
    let cellInfo = c.cellInfo
    this.flushOnOffspring.forEach((legacy_cell) => {
      if (legacy_cell.name === cellInfo.name) {
        this.flushCell(legacy_cell)
      }
    })
  }
  onCellMitosisComplete (c) {
    let cellInfo = c.cellInfo
    cellInfo.deploymentEnabledPath = c.path
    this.startedCells.forEach((legacy_cell) => {
      let legacyCellConditions = legacy_cell.mitosis.apoptosis.versionConditions
      if (legacy_cell.name === cellInfo.name &&
        this.is_version_legacy(legacyCellConditions, legacy_cell.version, cellInfo.version)) {
        if (legacy_cell.mitosis.flushOnOffspring) {
          this.flushOnOffspring.add(legacy_cell)
        } else {
          this.flushCell(legacy_cell)
        }
      }
    })
    this.startedCells.add(cellInfo)
  }
  async flushCell (legacy_cell) {
    console.info('flushing', legacy_cell)
    this.startedCells.remove(legacy_cell)
    this.flushOnOffspring.remove(legacy_cell)
    if (legacy_cell.deploymentEnabledPath) {
      await this.safeDelete(legacy_cell.deploymentEnabledPath)
      if (legacy_cell.mitosis.zygote) {
        await this.safeDelete(this.getDeploymentRunningPath(legacy_cell))
      }
    }
  }
  is_version_legacy (versionConditions, existing_version, new_version) {
    let diffValue = semverDiff(existing_version, new_version)
    return versionConditions.indexOf(diffValue) !== -1
  }
  safeDelete (filepath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filepath, (err) => {
        if (err) console.info(err)
        resolve()
      })
    })
  }
  getDeploymentRunningPath (cellInfo) {
    return path.join(this.dna.runningDeploymensLocation,
      [
        cellInfo.name,
        cellInfo.version,
        cellInfo.mitosis.mode,
        cellInfo.index || ''
      ].filter(v => v).join('-') + '.json')
  }
}
