package vn.iotstar.key;

import java.io.Serializable;
import java.util.Objects;


public class RequireID implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int skill;
	
	private int recruitmentNews;
	
	 @Override
		public boolean equals(Object o) {
			if (this == o) return true;
			if (!(o instanceof RequireID)) return false;
			RequireID that = (RequireID) o;
			return skill == that.skill &&
				recruitmentNews == that.recruitmentNews;
		}

		@Override
		public int hashCode() {
			return Objects.hash(skill, recruitmentNews);
		}

}
